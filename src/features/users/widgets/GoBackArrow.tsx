import { IconArrowLeft } from "@tabler/icons-react";

const GoBackArrow = ({ onClick }: any) => {
  return (
    <div className=" flex cursor-pointer  " onClick={onClick}>
      <IconArrowLeft stroke={4} size={32} />
    </div>
  );
};

export default GoBackArrow;
