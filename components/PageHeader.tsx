"use client"
import BackButton from "./BackButton";

const PageHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-gray-900 py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <BackButton />
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
        {description && (
          <p className="text-gray-400 max-w-2xl md:text-[20px]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
