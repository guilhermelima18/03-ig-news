import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { mocked } from "ts-jest/utils";
import PostPreview, { getStaticProps } from "../pages/posts/preview/[slug]";
import { getPrismicClient } from "../services/prismic";

const post = {
  slug: "my-new-post",
  title: "My new post",
  content: "<p>Post excerpt</p>",
  updatedAt: "21 de dezembro de 2022",
};

jest.mock("next/router");
jest.mock("../services/prismic");
jest.mock("next-auth/client");

describe("<Post />", () => {
  it("should renders correctly", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<PostPreview post={post} />);

    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("should redirects user to full post when user is subscribed", async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMocked = jest.fn();

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any);

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: "fake-active-subscription" },
      false,
    ]);

    render(<PostPreview post={post} />);

    expect(pushMocked).toHaveBeenCalledWith("/posts/my-new-post");
  });

  it("should loads initial data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {
              type: "heading",
              text: "My new post",
            },
          ],
          content: [
            {
              type: "paragraph",
              text: "Post content",
            },
          ],
        },
        last_publication_data: "2022-01-03",
      }),
    } as any);

    const response = await getStaticProps({
      params: { slug: "my-new-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-new-post",
            title: "My new post",
            content: "<p>Post content</p>",
            updatedAt: "21 de dezembro de 2022",
          },
        },
      })
    );
  });
});
