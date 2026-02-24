export interface View {
    displayErrorMessage(message: string): void;
}

export default abstract class Presenter<V extends View> {
    private _view: V;

    protected constructor(view: V) {
        this._view = view;
    }

    protected get view(): V {
        return this._view;
    }

    protected async doFailureReportingOperation(
        operation: () => Promise<void>,
        description: string
    ): Promise<void> {
        try {
            await operation();
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Unknown error";
            this.view.displayErrorMessage(`Failed to ${description}: ${msg}`);
        }
    }
}