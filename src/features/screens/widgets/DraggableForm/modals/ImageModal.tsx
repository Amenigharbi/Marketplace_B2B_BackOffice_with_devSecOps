import React, { useState, useEffect } from "react";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageFormSchema, ImageFormValues } from "./types";
import TextInput from "../../inputs/TextInput";
import DateInput from "../../inputs/DateInput";
import useAxios from "../../../hooks/useAxios";
import { toast } from "react-hot-toast";
import SingleFileInput from "../../inputs/SingleFileInput";

interface SelectedElement {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string[];
  startDate?: string;
  endDate?: string;
}

interface ImageModalProps {
  selectedElement: SelectedElement;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  selectedElement,
  onClose,
}) => {
  const [previewUrls, setPreviewUrls] = useState<any>([]);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ImageFormValues>({
    resolver: zodResolver(ImageFormSchema),
    defaultValues: {
      title: selectedElement.title,
      description: selectedElement.description || "",
      images: undefined,
      startDate: selectedElement.startDate || "",
      endDate: selectedElement.endDate || "",
    },
  });

  const { fetchData } = useAxios();

  useEffect(() => {
    reset({
      title: selectedElement.title,
      description: selectedElement.description || "",
      images: undefined,
      startDate: selectedElement.startDate || "",
      endDate: selectedElement.endDate || "",
    });

    if (selectedElement.imageUrl) {
      setPreviewUrls(selectedElement.imageUrl);
    } else {
      setPreviewUrls([]);
    }
  }, [selectedElement, reset]);

  const onSubmit: SubmitHandler<ImageFormValues> = async (formData) => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);

    if (formData.images && formData.images.length > 0) {
      Array.from(formData.images).forEach((file: any) => {
        data.append("images", file);
      });
    }

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
      toast.error("Failed to update image. Please try again.");
    }
  };

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  return (
    <>
      <ModalHeader>
        <h2 className="text-xl font-bold">Edit Image</h2>
      </ModalHeader>
      <ModalBody className="h-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-5">
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
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <SingleFileInput
                id="images"
                label="Image"
                accept="image/*"
                previewUrls={previewUrls}
                onChange={(files) => {
                  field.onChange(files);
                }}
              />
            )}
          />

          <div className="flex w-full justify-end">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>
      </ModalBody>
    </>
  );
};

export default ImageModal;
