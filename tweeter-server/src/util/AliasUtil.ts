export class AliasUtil {
  public static normalize(alias: string): string {
    const trimmed = alias.trim();
    return trimmed.startsWith("@") ? trimmed.substring(1) : trimmed;
  }
}