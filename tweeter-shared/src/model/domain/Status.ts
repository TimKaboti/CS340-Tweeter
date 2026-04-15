import { PostSegment, Type } from "./PostSegment";
import { User } from "./User";
import { format } from "date-fns";

export class Status {
  private _id: string;
  private _post: string;
  private _user: User;
  private _timestamp: number;
  private _segments: PostSegment[];

  public constructor(
    id: string,
    post: string,
    user: User,
    timestamp: number
  ) {
    this._id = id;
    this._post = post;
    this._user = user;
    this._timestamp = timestamp;
    this._segments = this.getPostSegments(post);
  }

  public get id(): string {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }

  

  private getPostSegments(post: string): PostSegment[] {
    const segments: PostSegment[] = [];

    let startIndex = 0;

    for (let reference of Status.getSortedReferences(post)) {
      if (startIndex < reference.startPostion) {
        segments.push(
          new PostSegment(
            post.substring(startIndex, reference.startPostion),
            startIndex,
            reference.startPostion - 1,
            Type.text
          )
        );
      }

      segments.push(reference);
      startIndex = reference.endPosition;
    }

    if (startIndex < post.length) {
      segments.push(
        new PostSegment(
          post.substring(startIndex),
          startIndex,
          post.length,
          Type.text
        )
      );
    }

    return segments;
  }

  private static getSortedReferences(post: string): PostSegment[] {
    const references = [
      ...Status.parseUrlReferences(post),
      ...Status.parseMentionReferences(post),
      ...Status.parseNewlines(post),
    ];

    references.sort((a, b) => {
      return a.startPostion - b.startPostion;
    });

    return references;
  }

  private static parseUrlReferences(post: string): PostSegment[] {
    const references: PostSegment[] = [];
    const urls: string[] = Status.parseUrls(post);

    let previousStartIndex = 0;

    for (let url of urls) {
      let startIndex = post.indexOf(url, previousStartIndex);

      if (startIndex > -1) {
        references.push(
          new PostSegment(url, startIndex, startIndex + url.length, Type.url)
        );

        startIndex += url.length;
        previousStartIndex = startIndex;
      }
    }

    return references;
  }

  private static parseUrls(post: string): string[] {
    const urls: string[] = [];

    for (let word of post.split(/(\s+)/)) {
      if (word.startsWith("http://") || word.startsWith("https://")) {
        const endIndex = Status.findUrlEndIndex(word);
        urls.push(word.substring(0, endIndex));
      }
    }

    return urls;
  }

  private static findUrlEndIndex(word: string): number {
    let index;

    if (word.includes(".com")) index = word.indexOf(".com") + 4;
    else if (word.includes(".net")) index = word.indexOf(".net") + 4;
    else if (word.includes(".org")) index = word.indexOf(".org") + 4;
    else if (word.includes(".edu")) index = word.indexOf(".edu") + 4;
    else if (word.includes(".mil")) index = word.indexOf(".mil") + 4;
    else {
      index = word.length;
      while (!Status.isLetter(word[index])) index--;
    }

    return index;
  }

  private static isLetter(c: string): boolean {
    return c.length === 1 && c.match(/[a-zA-Z]/g) != null;
  }

  private static parseMentionReferences(post: string): PostSegment[] {
    const references: PostSegment[] = [];
    const mentions: string[] = Status.parseMentions(post);

    let previousStartIndex = 0;

    for (let mention of mentions) {
      let startIndex = post.indexOf(mention, previousStartIndex);

      if (startIndex > -1) {
        references.push(
          new PostSegment(
            mention,
            startIndex,
            startIndex + mention.length,
            Type.alias
          )
        );

        startIndex += mention.length;
        previousStartIndex = startIndex;
      }
    }

    return references;
  }

  private static parseMentions(post: string): string[] {
    const mentions: string[] = [];

    for (let word of post.split(/(\s+)/)) {
      if (word.startsWith("@")) {
        mentions.push(word.replace(/[^a-zA-Z0-9@]/g, ""));
      }
    }

    return mentions;
  }

  private static parseNewlines(post: string): PostSegment[] {
    const newlines: PostSegment[] = [];
    const regex = /\n/g;

    let match;
    while ((match = regex.exec(post)) !== null) {
      const index = match.index;
      newlines.push(
        new PostSegment("\n", index, index + 1, Type.newline)
      );
    }

    return newlines;
  }

  public get post(): string {
    return this._post;
  }

  public set post(value: string) {
    this._post = value;
  }

  public get user(): User {
    return this._user;
  }

  public set user(value: User) {
    this._user = value;
  }

  public get timestamp(): number {
    return this._timestamp;
  }

  public set timestamp(value: number) {
    this._timestamp = value;
  }

  public get formattedDate(): string {
    return format(new Date(this.timestamp), "MMMM dd, yyyy HH:mm:ss");
  }

  public get segments(): PostSegment[] {
    return this._segments;
  }

  public set segments(value: PostSegment[]) {
    this._segments = value;
  }

  public equals(other: Status): boolean {
    return (
      this._id === other._id &&
      this._user.equals(other.user) &&
      this._timestamp === other._timestamp &&
      this._post === other.post
    );
  }

  public static fromJson(json: string | null | undefined): Status | null {
    if (!!json) {
      const obj = JSON.parse(json);
      return new Status(
        obj._id,
        obj._post,
        new User(
          obj._user._firstName,
          obj._user._lastName,
          obj._user._alias,
          obj._user._imageUrl
        ),
        obj._timestamp
      );
    }
    return null;
  }

  public toJson(): string {
    return JSON.stringify(this);
  }
}