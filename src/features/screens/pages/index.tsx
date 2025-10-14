"use client";
import React, { useState, useEffect } from "react";
import { IconFilePlus } from "@tabler/icons-react";
import CreateAdModal from "../widgets/CreateScreenModal";
import Card from "../widgets/Card";
import Pagination from "../widgets/Pagination";
import useAxios from "../hooks/useAxios";

interface ScreenData {
  id: string;
  name: string;
}

interface PaginationData {
  totalPages: number;
}

interface ApiResponse {
  screens: ScreenData[];
  pagination: PaginationData;
}

const Screen: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [data, setData] = useState<ScreenData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const { loading, error, fetchData, response } = useAxios<{
    data: ApiResponse;
  }>();

  const apiKey: string | undefined = process.env.NEXT_PUBLIC_API_KEY;

  const fetchForms = async (page: number = 1): Promise<void> => {
    if (!apiKey) {
      console.error("API key is not set.");
      return;
    }

    await fetchData(
      `api/screen?page=${page}&limit=5`,
      "get",
      undefined,
      undefined,
      apiKey,
    );
  };

  useEffect(() => {
    fetchForms(currentPage);
  }, [currentPage, showModal]);

  useEffect(() => {
    if (response && response.data) {
      const apiResponse = response.data as any;
      setData(apiResponse.screens);
      setTotalPages(apiResponse.pagination.totalPages);
    }
  }, [response]);

  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="mt-[4.8rem] h-full w-full bg-n20 p-4">
      <div className="p-8">
        <h1 className="mb-6 text-2xl font-bold">Your screen</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8"
            onClick={() => setShowModal(true)}
          >
            <IconFilePlus size={48} className="text-gray-600" />
            <button className="mt-4 text-gray-600">Create new screen</button>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : data?.length > 0 ? (
            data.map((data, index) => (
              <Card data={data} index={index} key={index} />
            ))
          ) : (
            <p className="text-gray-500">No screens available.</p>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <CreateAdModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default Screen;
