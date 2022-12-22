import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import Home, { getStaticProps } from "../pages";
import { stripe } from "../services/stripe";

const homeProps = {
  priceId: "1",
  amount: 20,
};

jest.mock("next/router");
jest.mock("next-auth/client", () => {
  return {
    useSession() {
      return [null, false];
    },
  };
});
jest.mock("../services/stripe");

describe("<Home />", () => {
  it("should renders correctly", () => {
    render(
      <Home
        product={{ priceId: homeProps.priceId, amount: homeProps.amount }}
      />
    );

    expect(
      screen.getByText(`for ${homeProps.amount} month`)
    ).toBeInTheDocument();
  });

  it("should loads initial data", async () => {
    const retriveStripePricesMocked = mocked(stripe.prices.retrieve);

    retriveStripePricesMocked.mockResolvedValueOnce({
      id: "fake-price-id",
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fake-price-id",
            amount: "$10.00",
          },
        },
      })
    );
  });
});
