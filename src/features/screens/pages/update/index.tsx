import { useEffect, useState } from "react";
import DraggableForm from "../../widgets/DraggableForm/DraggableForm";
import { usePathname, useRouter } from "@/libs/next-intl/i18nNavigation";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-hot-toast";
import { AxiosResponse } from "axios";

interface FormElement {
  id: string;
  _id: string;
  title: string;
}

interface ScreenData {
  id: string;
  title: string;
  status: "draft" | "active" | "inactive";
  ad: FormElement[];
}

const UpdatePage: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const id = pathname.split("/").pop() || "";

  const [elements, setElements] = useState<any>([
    { id: "1", title: "image" },
    { id: "2", title: "carousel" },
    { id: "3", title: "ProductShowcase" },
  ]);

  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<ScreenData | null>(null);
  const [title, setTitle] = useState<string>("");

  const { fetchData } = useAxios();
  const apiKey: string | undefined = process.env.NEXT_PUBLIC_API_KEY;

  const fetchForms = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response: any = await fetchData(
        `api/screen/${id}`,
        "get",
        undefined,
        {
          headers: { "X-API-Key": apiKey },
        },
      );

      if (response.data) {
        const screenData = response.data;
        setData(screenData);
        setFormElements(screenData.ad || []);
        setTitle(screenData.title || "");
      } else {
        console.error("Failed to fetch data");
        toast.error("Failed to fetch data. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleSave = async (): Promise<void> => {
    if (!data) return;

    setIsLoading(true);
    try {
      const newData: ScreenData = { ...data, ad: formElements, title };

      await fetchData(`api/screen/${id}`, "put", newData, {
        headers: { "X-API-Key": apiKey },
      });

      toast.success("Screen saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await fetchData(`api/screen/${id}/activate`, "put", undefined, {
        headers: { "X-API-Key": apiKey },
      });

      toast.success("Screen published successfully!");
    } catch (error) {
      console.error("Error publishing data:", error);
      toast.error("Failed to publish data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatusIcon = (
    status: "draft" | "active" | "inactive",
  ): JSX.Element | null => {
    switch (status) {
      case "draft":
        return (
          <svg
            className="h-6 w-6 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "active":
        return (
          <svg
            className="h-6 w-6 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "inactive":
        return (
          <svg
            className="h-6 w-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-[4.8rem] h-full w-full bg-n20">
      <div className="flex h-[60px] w-full flex-row items-center justify-between border-b-1 border-b-gray-500 bg-white px-4">
        <div className="flex items-center gap-x-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center rounded p-2 hover:bg-gray-100"
          >
            <svg
              className="h-6 w-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          <h2 className="text-xl font-bold">
            Screen :
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded px-2 py-1 text-xl font-bold"
            />
          </h2>

          {data?.status && (
            <div className="flex items-center gap-x-2">
              {renderStatusIcon(data.status)}
              <span className="text-sm font-semibold capitalize">
                {data.status}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-x-4">
          <button
            className="inline-flex items-center rounded border border-gray-500 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
            onClick={handleSave}
            disabled={isLoading}
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handlePublish}
            className="inline-flex items-center rounded border border-gray-500 bg-blue-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            {isLoading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
      <DraggableForm
        elements={elements}
        formElements={formElements}
        setFormElements={setFormElements}
      />
    </div>
  );
};

export default UpdatePage;
