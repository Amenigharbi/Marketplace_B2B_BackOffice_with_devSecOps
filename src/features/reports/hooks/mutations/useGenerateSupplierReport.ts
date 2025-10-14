import { toast } from "react-hot-toast";
import { magento } from "@/clients/magento";
import { useMutation } from "@tanstack/react-query";

type Params = {
  toDate: string;
  fromDate: string;
  supplierId: string;
};

export const useGenerateSupplierReport = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ supplierId, fromDate, toDate }: Params) => {
      const url = await magento.mutations.generateSupplierReport({
        supplierId,
        fromDate,
        toDate,
      });

      return url;
    },
    onSuccess: (url) => {
      window.open(url);

      toast.success(`Supplier Report  Generated Successfully`, {
        duration: 5000,
      });
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return { generateSupplierReport: mutate, isPending };
};
