const Banner = ({
  title,
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="m-2 flex flex-wrap items-center justify-between gap-4 ">
      <h2 className="h2 capitalize">{title}</h2>
      {children}
    </div>
  );
};

export default Banner;
