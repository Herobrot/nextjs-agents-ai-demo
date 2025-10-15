import React from "react";
import { ComparisonCardProps, Metric } from "../../../../utils/metrics";

const ComparisonCard = ({ title, data }: ComparisonCardProps) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1">
      <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        {title}
      </h2>
      <ul className="space-y-4">
        {data.map((metric: Metric, index: number) => (
          <li
            key={metric.name}
            className="flex justify-between items-center bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700/70 transition-colors duration-200 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="font-semibold text-gray-300 group-hover:text-white transition-colors duration-200">
              {metric.name}
            </span>
            <span className="text-lg font-bold text-purple-400 group-hover:text-purple-300 transition-colors duration-200">
              {metric.value}{" "}
              <span className="text-sm text-gray-500">{metric.unit}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComparisonCard;
