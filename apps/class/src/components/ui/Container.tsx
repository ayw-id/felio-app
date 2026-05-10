import React from "react";

interface ContainerProps {
  title: string;
  subTitle: string;
  children: React.ReactNode | React.ReactNode[];
}
const Container: React.FC<ContainerProps> = ({ children, title, subTitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{subTitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Container;
