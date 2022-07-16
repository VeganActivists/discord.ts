/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

export type RedditResponse = ReadonlyArray<RedditPackage>;

export type RedditPackage = {
  readonly data: {
    readonly children: ReadonlyArray<{ readonly data: RedditPost }>;
  };
  readonly kind: 'Listing';
};

export type RedditPost = {
  readonly kind: 't3';
  readonly permalink: string;
  readonly post_hint: string;
  readonly title: string;
  readonly url: string;
};

export async function getRedditImage(depth = 0): Promise<RedditPost> {
  return fetch('https://www.reddit.com/r/Awwducational/random.json', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => response.json())
    .then((responseJson) =>
      ((testJsonResponse): testJsonResponse is RedditResponse =>
        typeof testJsonResponse === 'object' &&
        Array.isArray(testJsonResponse) &&
        'kind' in testJsonResponse[0] &&
        'data' in testJsonResponse[0])(responseJson)
        ? responseJson[0]?.data.children[0]?.data.post_hint === 'image'
          ? responseJson[0].data.children[0].data
          : getRedditImage(depth + 1)
        : getRedditImage(depth + 1),
    );
}
