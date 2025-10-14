import React, { useEffect, useState } from "react";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import {
  SubmitHandler,
  useForm,
  Controller,
  FieldError,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CarouselFormSchema, CarouselFormValues } from "./types";
import TextInput from "../../inputs/TextInput";
import DateInput from "../../inputs/DateInput";
import useAxios from "../../../hooks/useAxios";
import toast from "react-hot-toast";
import MultipleFileInput from "../../inputs/MultipleFileInput";
import { DynamicSelectInput } from "../../inputs/DynamicSelectInput";

interface CarouselModalProps {
  selectedElement: {
    _id: string;
    title: string;
    description?: string;
    imageUrl?: string[];
    clickUrl?: string[];
    startDate?: string;
    endDate?: string;
  };
  onClose: () => void;
}

const CarouselModal: React.FC<CarouselModalProps> = ({
  selectedElement,
  onClose,
}) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CarouselFormValues>({
    resolver: zodResolver(CarouselFormSchema),
    defaultValues: {
      title: selectedElement?.title || "",
      description: selectedElement?.description || "",
      images: undefined,
      clickUrl: selectedElement?.clickUrl || [""],
      startDate: selectedElement?.startDate || "",
      endDate: selectedElement?.endDate || "",
    },
  });

  const { loading, error: axiosError, fetchData } = useAxios();

  useEffect(() => {
    reset({
      title: selectedElement?.title || "",
      description: selectedElement?.description || "",
      images: undefined,
      clickUrl: selectedElement?.clickUrl || [""],
      startDate: selectedElement?.startDate || "",
      endDate: selectedElement?.endDate || "",
    });
    if (selectedElement.imageUrl) {
      setPreviewUrls(selectedElement.imageUrl);
    } else {
      setPreviewUrls([]);
    }
  }, [selectedElement, reset]);

  const onSubmit: SubmitHandler<CarouselFormValues> = async (formData) => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);

    if (formData.images && formData.images.length > 0) {
      Array.from(formData.images).forEach((file) => {
        data.append("images", file);
      });
    }

    formData.clickUrl.forEach((url) => {
      if (url.trim()) {
        data.append("clickUrl", url.trim());
      }
    });

    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    try {
      const response = await fetchData(
        `api/ad/${selectedElement._id}`,
        "put",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-Key": apiKey,
          },
        },
      );

      if (response && response.data) {
        toast.success("Image updated successfully!");
        onClose();
      } else {
        toast.error("Failed to update image. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        axiosError?.message || "Failed to update image. Please try again.",
      );
    }
  };

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const clickUrlOptions = [
    "Home",
    "ProductsList",
    "UserProfileRetailer",
    "كاتالوغ",
    "Cart",
  ] as const;

  return (
    <>
      <ModalHeader>
        <h2 className="text-xl font-bold">Edit Carousel</h2>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-10">
          <TextInput
            label="Title"
            placeholder="Enter your Title"
            register={register("title")}
            isError={!!errors.title}
            errorMessage={errors.title?.message}
          />
          <TextInput
            label="Description"
            placeholder="Enter your description"
            register={register("description")}
            isError={!!errors.description}
            errorMessage={errors.description?.message}
          />

          <div>
            <label className="block font-medium md:text-lg">Start Date</label>
            <DateInput
              value={startDate}
              onChange={(date) => setValue("startDate", date)}
              placeholder="Select start date"
            />
            {errors.startDate && (
              <p className="mt-2 text-sm text-red-600">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium md:text-lg">End Date</label>
            <DateInput
              value={endDate}
              onChange={(date) => setValue("endDate", date)}
              placeholder="Select end date"
            />
            {errors.endDate && (
              <p className="mt-2 text-sm text-red-600">
                {errors.endDate.message}
              </p>
            )}
          </div>

          <DynamicSelectInput
            name="clickUrl"
            options={clickUrlOptions}
            register={register}
            control={control}
            label="Click URLs"
            errors={errors.clickUrl as FieldError | (FieldError | undefined)[]}
          />

          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <MultipleFileInput
                id="images"
                label="Images"
                accept="image/*"
                onChange={(files) => {
                  field.onChange(files);
                }}
                previewUrls={previewUrls}
              />
            )}
          />
          {errors.images && (
            <p className="mt-2 text-sm text-red-600">{errors.images.message}</p>
          )}

          <div className="flex w-full justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </ModalBody>
    </>
  );
};

export default CarouselModal;
