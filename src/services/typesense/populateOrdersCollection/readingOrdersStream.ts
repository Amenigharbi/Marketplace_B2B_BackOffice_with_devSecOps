import { Readable } from "stream";
import { magento } from "@/clients/magento";

type MagentoOrderResponse = { items: any[] } | "Unauthorized";
type MagentoPageCountResponse = { pagesCount: number } | "Unauthorized";

export const readingOrdersStream = () => {
  let page = 1;
  let isEnd = false;

  return new Readable({
    async read() {
      try {
        if (isEnd) {
          this.push(null);
          return;
        }

        const pageCountResponse: MagentoPageCountResponse =
          await magento.queries.getAllOrdersPagesCount();

        if (pageCountResponse === "Unauthorized") {
          this.emit("error", new Error("Unauthorized access"));
          return;
        }

        const { pagesCount } = pageCountResponse;

        if (page <= pagesCount) {
          console.info(
            "Fetching orders from page",
            page,
            "of",
            pagesCount,
            "total pages ...",
          );

          const ordersResponse: MagentoOrderResponse =
            await magento.queries.getOrdersByBatch(page);

          if (ordersResponse === "Unauthorized") {
            this.emit("error", new Error("Unauthorized access"));
            return;
          }

          const { items } = ordersResponse;

          this.push(JSON.stringify(items));
          page++;
          return;
        }

        isEnd = true;
        console.info("Orders fetching completed successfully");
      } catch (error) {
        this.emit("error", error);
      }
    },
  });
};
