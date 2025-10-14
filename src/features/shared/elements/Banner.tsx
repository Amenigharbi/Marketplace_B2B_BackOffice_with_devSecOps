const Banner = ({
  title = "Dashboard",
  links,
}: {
  title?: string;
  links?: React.ReactNode;
}) => {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 lg:mb-8">
      <h2 className="h2">{title}</h2>
      {links}
    </div>
  );
};

export default Banner;
