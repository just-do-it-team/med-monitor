import React, { ReactNode } from "react";
import { ChartDataType } from "@/entities/chart";

interface FHRChartProps {
  fhrData: ChartDataType[];
  width?: number;
  height?: number;
  duration?: number;
  currentTime?: number;
}

export const FhrChart: React.FC<FHRChartProps> = ({
  fhrData,
  width = 1200,
  height = 300,
  duration = 20,
  currentTime = 0,
}) => {
  const margin = { top: 20, right: 35, bottom: 20, left: 15 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const isScrolling = currentTime > duration;
  const timeOffset = isScrolling ? currentTime - duration : 0;
  const windowStart = timeOffset;
  const windowEnd = windowStart + duration;

  const xScale = (time: number) =>
    ((time - windowStart) / duration) * chartWidth;
  const fhrScale = (heartRate: number) =>
    chartHeight - ((heartRate - 60) / (200 - 60)) * chartHeight;

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

  const generateFHRHorizontalLines = () => {
    const lines = [];

    for (let bpm = 60; bpm <= 200; bpm += 20) {
      const y = fhrScale(bpm);
      const isMainLine = bpm === 60 || bpm === 200;
      lines.push(
        <line
          key={`fhr-h-${bpm}`}
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

    for (let bpm = 60; bpm <= 200; bpm += 10) {
      if (bpm % 20 !== 0) {
        const y = fhrScale(bpm);
        lines.push(
          <line
            key={`fhr-fine-h-${bpm}`}
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

  const generateFHRPath = () => {
    if (fhrData.length === 0) return "";

    const visibleData = fhrData.filter(
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
      const y = fhrScale(point.value);

      if (!started) {
        path += `M ${x} ${y}`;
        started = true;
      } else {
        path += ` L ${x} ${y}`;
      }
    }

    return path;
  };

  const generateFHRCenterLabels = () => {
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

    for (let bpm = 60; bpm <= 200; bpm += 20) {
      const y = fhrScale(bpm);

      centerPositions.forEach((centerX, index) => {
        labels.push(
          <text
            key={`fhr-center-label-${bpm}-${index}`}
            x={centerX + 6}
            y={y + 10}
            fontSize="12"
            fill="#2c3e50"
            textAnchor="start"
          >
            {bpm}
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

  const generateBackgroundSegments = () => {
    const segments = [];
    const visibleData = fhrData.filter(
      (point) => point.time >= windowStart && point.time <= windowEnd,
    );

    for (let i = 0; i < visibleData.length - 1; i++) {
      const currentPoint = visibleData[i];
      const nextPoint = visibleData[i + 1];

      if (currentPoint.fl === "01" || currentPoint.fl === "11") {
        const x1 = xScale(currentPoint.time);
        const x2 = xScale(nextPoint.time);
        const width = x2 - x1;

        segments.push(
          <rect
            key={`bg-segment-${i}`}
            x={x1}
            y={0}
            width={width}
            height={chartHeight}
            fill="#ffb9b9"
            opacity="0.5"
          />,
        );
      }
    }

    return segments;
  };

  return (
    <div className="overflow-hidden">
      <svg width={width} height={height} className="bg-veryLightGray">
        <defs>
          <clipPath id="fhr-chart-area">
            <rect x="0" y="0" width={chartWidth} height={chartHeight} />
          </clipPath>
        </defs>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {generateBackgroundSegments()}

          {generateVerticalLines()}
          {generateFHRHorizontalLines()}

          <g clipPath="url(#fhr-chart-area)">
            <path
              d={generateFHRPath()}
              fill="none"
              stroke="#000"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
          {generateFHRCenterLabels()}
          {generateTimeLabels()}
        </g>
      </svg>
    </div>
  );
};
