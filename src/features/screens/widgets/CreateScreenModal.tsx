import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Modal,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
} from "@nextui-org/react";
import { SelectInput } from "./inputs/SelectInput";
import { toast } from "react-hot-toast";
import useAxios from "../hooks/useAxios";

type CreateScreenModalProps = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
};

const titleOptions = [
  "Home",
  "ProductsList",
  "UserProfileRetailer",
  "كاتالوغ",
  "Cart",
] as const;

const screenSchema = z.object({
  title: z.enum(titleOptions, { message: "Please select a valid title" }),
  description: z.string().min(1, { message: "Description is required" }),
});

type ScreenFormData = z.infer<typeof screenSchema>;

const CreateAdModal = ({ showModal, setShowModal }: CreateScreenModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ScreenFormData>({
    resolver: zodResolver(screenSchema),
  });

  const { loading, fetchData } = useAxios();

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const onSubmit = async (data: ScreenFormData) => {
    try {
      await fetchData(
        "api/screen",
        "post",
        { title: data.title, description: data.description },
        { headers: { "X-API-Key": apiKey } },
      );

      toast.success("Screen created successfully!");
      setShowModal(false);
      reset();
    } catch (error) {
      console.error("Error creating screen:", error);

      toast.error("Failed to create screen. Please try again.");
    }
  };

  return (
    <>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalContent>
          <ModalHeader>Create Screen</ModalHeader>
          <ModalBody>
            <p className="mb-4 text-gray-500">Create a new Screen</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <SelectInput
                name="title"
                options={titleOptions}
                register={register}
                errors={errors.title}
                label="Title"
              />

              <label className="mb-2 block">Description</label>
              <textarea
                {...register("description")}
                className="mb-4 w-full rounded-lg border p-2"
              ></textarea>
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}

              <ModalFooter>
                <Button color="default" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateAdModal;
