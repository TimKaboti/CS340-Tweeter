import React, { useEffect, useState } from "react";
import { AuthToken } from "tweeter-shared";
import PagedItemPresenter, { PagedItemView } from "../../presenter/PagedItemPresenter";

type PresenterFactory<T> = (view: PagedItemView<T>) => PagedItemPresenter<T>;

interface Props<T> {
    authToken: AuthToken;
    userOrAlias: string;
    pageSize: number;

    presenterFactory: PresenterFactory<T>;
    itemComponentGenerator: (item: T) => JSX.Element;
}

export default function ItemScroller<T>(props: Props<T>) {
    const { authToken, userOrAlias, pageSize, presenterFactory, itemComponentGenerator } = props;

    const [items, setItems] = useState<T[]>([]);
    const [presenter] = useState(() =>
        presenterFactory({
            addItems: (newItems: T[]) => setItems((prev) => [...prev, ...newItems]),
            displayErrorMessage: (message: string) => alert(message),
        })
    );

    useEffect(() => {
        const loadFirstPage = async () => {
            presenter.reset();
            setItems([]);
            await presenter.loadMoreItems(authToken, userOrAlias, pageSize); // ✅ await
        };

        loadFirstPage();
    }, [authToken, , pageSize, presenter]);

    const loadMore = async () => {
        if (!presenter.hasMoreItems) return;
        await presenter.loadMoreItems(authToken, userOrAlias, pageSize);
    };

    const onScroll = async (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const nearBottom =
            target.scrollTop + target.clientHeight >= target.scrollHeight - 40;

        if (nearBottom) {
            await loadMore();
        }
    };

    return (
        <div onScroll={onScroll} style={{ overflowY: "auto", maxHeight: "70vh" }}>
            {items.map((item, index) => (
                <div key={index}>{itemComponentGenerator(item)}</div>
            ))}
        </div>
    );
}