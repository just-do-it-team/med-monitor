import React, { ReactNode } from "react";
import { ChartDataType } from "@/entities/chart";

interface UCChartProps {
  ucData: ChartDataType[];
  width?: number;
  height?: number;
  duration?: number;
  currentTime?: number;
}

export const UcChart: React.FC<UCChartProps> = ({
  ucData,
  width = 1200,
  height = 300,
  duration = 20,
  currentTime = 0,
}) => {
  const margin = { top: 20, right: 35, bottom: 20, left: 10 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const isScrolling = currentTime > duration;
  const timeOffset = isScrolling ? currentTime - duration : 0;
  const windowStart = timeOffset;
  const windowEnd = windowStart + duration;

  const xScale = (time: number) =>
    ((time - windowStart) / duration) * chartWidth;
  const ucScale = (pressure: number) =>
    chartHeight - (pressure / 100) * chartHeight;

  const generateVerticalLines = () => {
    const lines = [];

    const startTime = Math.floor(windowStart / 10) * 10;
    const endTime = Math.ceil(windowEnd / 10) * 10;

    for (let i = startTime; i <= endTime; i += 10) {
      if (i >= windowStart && i <= windowEnd) {
        const x = xScale(i);
        if (x >= 0 && x <= chartWidth) {
          lines.push(
            <line
              key={`major-v-${i}`}
              x1={x}
              y1={0}
              x2={x}
              y2={chartHeight}
              stroke="#e74c3c"
              strokeWidth="1.5"
              opacity="0.7"
            />,
          );
        }
      }
    }

    for (let i = Math.floor(windowStart); i <= Math.ceil(windowEnd); i += 1) {
      if (i % 10 !== 0 && i >= windowStart && i <= windowEnd) {
        const x = xScale(i);
        if (x >= 0 && x <= chartWidth) {
          lines.push(
            <line
              key={`minor-v-${i}`}
              x1={x}
              y1={0}
              x2={x}
              y2={chartHeight}
              stroke="#c56d6d"
              strokeWidth="0.6"
              opacity="0.6"
            />,
          );
        }
      }
    }

    for (
      let i = Math.floor(windowStart * 2) / 2;
      i <= Math.ceil(windowEnd * 2) / 2;
      i += 0.5
    ) {
      if (i % 1 !== 0 && i >= windowStart && i <= windowEnd) {
        const x = xScale(i);
        if (x >= 0 && x <= chartWidth) {
          lines.push(
            <line
              key={`fine-v-${i}`}
              x1={x}
              y1={0}
              x2={x}
              y2={chartHeight}
              stroke="#d5d5d5"
              strokeWidth="0.6"
              opacity="0.6"
            />,
          );
        }
      }
    }

    return lines;
  };

  const generateUCHorizontalLines = () => {
    const lines = [];

    for (let pressure = 0; pressure <= 100; pressure += 20) {
      const y = ucScale(pressure);
      const isMainLine = pressure === 0 || pressure === 100;
      lines.push(
        <line
          key={`uc-h-${pressure}`}
          x1={0}
          y1={y}
          x2={chartWidth}
          y2={y}
          stroke={"#c21212"}
          strokeWidth={isMainLine ? "0.5" : "0.5"}
          opacity={isMainLine ? "1" : "0.5"}
        />,
      );
    }

    for (let pressure = 0; pressure <= 100; pressure += 10) {
      if (pressure % 20 !== 0) {
        const y = ucScale(pressure);
        lines.push(
          <line
            key={`uc-fine-h-${pressure}`}
            x1={0}
            y1={y}
            x2={chartWidth}
            y2={y}
            stroke="#d5d5d5"
            strokeWidth="0.6"
            opacity="0.6"
          />,
        );
      }
    }
    return lines;
  };

  const generateUCPath = () => {
    if (ucData.length === 0) return "";

    const visibleData = ucData.filter(
      (point) => point.time >= windowStart && point.time <= windowEnd,
    );

    if (visibleData.length === 0) return "";

    let path = "";
    let started = false;

    for (let i = 0; i < visibleData.length; i++) {
      const point = visibleData[i];
      if (point.value == null) {
        started = false;
        continue;
      }

      const x = xScale(point.time);
      const y = ucScale(point.value);

      if (!started) {
        path += `M ${x} ${y}`;
        started = true;
      } else {
        path += ` L ${x} ${y}`;
      }
    }

    return path;
  };

  const generateUCCenterLabels = () => {
    const labels: ReactNode[] = [];

    const centerPositions = [];
    const startTime = Math.floor(windowStart / 10) * 10;
    const endTime = Math.ceil(windowEnd / 10) * 10;

    for (let time = startTime; time <= endTime; time += 10) {
      if (time >= windowStart && time <= windowEnd) {
        const centerX = xScale(time);
        if (centerX >= 0 && centerX <= chartWidth) {
          centerPositions.push(centerX);
        }
      }
    }

    for (let pressure = 0; pressure <= 100; pressure += 20) {
      const y = ucScale(pressure);

      centerPositions.forEach((centerX, index) => {
        labels.push(
          <text
            key={`uc-center-label-${pressure}-${index}`}
            x={centerX + 6}
            y={y + 10}
            fontSize="12"
            fill="#2c3e50"
            textAnchor="start"
          >
            {pressure}
          </text>,
        );
      });
    }
    return labels;
  };

  const generateTimeLabels = () => {
    const labels = [];
    const startTime = Math.floor(windowStart / 10) * 10;
    const endTime = Math.ceil(windowEnd / 10) * 10;

    for (let time = startTime; time <= endTime; time += 10) {
      if (time >= windowStart && time <= windowEnd) {
        const x = xScale(time);
        if (x >= 0 && x <= chartWidth) {
          labels.push(
            <text
              key={`time-label-${time}`}
              x={x}
              y={-5}
              fontSize="12"
              fill="#2c3e50"
              textAnchor="middle"
            >
              {time}
            </text>,
          );
        }
      }
    }
    return labels;
  };

  return (
    <div className="overflow-hidden">
      <svg width={width} height={height} className="bg-veryLightGray">
        <defs>
          <clipPath id="uc-chart-area">
            <rect x="0" y="0" width={chartWidth} height={chartHeight} />
          </clipPath>
        </defs>
        <g transform={`translate(${margin.left}, ${margin.top})`}>

          {generateVerticalLines()}
          {generateUCHorizontalLines()}

          <g clipPath="url(#uc-chart-area)">
            <path
              d={generateUCPath()}
              fill="none"
              stroke="#000"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
          {generateUCCenterLabels()}
          {generateTimeLabels()}
        </g>
      </svg>
    </div>
  );
};
