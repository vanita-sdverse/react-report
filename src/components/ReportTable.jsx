import React, { useState } from "react";
import "../styles/App.css"; // ✅ No 'styles' variable

const ReportTable = ({ reportData, monthHeaders, isYearView = true, detailLevel = "standard" }) => {
  const [collapsedSections, setCollapsedSections] = useState({});

  if (!reportData) return null;

  const years = Object.keys(reportData);

  // Step 1: Flatten reportData by label
  const lineMap = {};

  years.forEach((year) => {
    const yearData = reportData[year];
    Object.entries(yearData).forEach(([label, line]) => {
      if (!lineMap[label]) {
        lineMap[label] = {
          label,
          type: line.type ?? 0,
          variation: line.variation,
          partOfRevenue: line.partOfRevenue,
          values: {},
        };
      }
      lineMap[label].values[year] = line.total ?? null;
    });
  });

  const allLines = Object.values(lineMap);

  const getColumnWidth = () => {
    const colCount = years.length;
    return {
      labelWidth: "25%",
      colWidth: `${(75 / colCount).toFixed(2)}%`,
    };
  };

  const { labelWidth, colWidth } = getColumnWidth();

  const getRowClass = (type) => {
    if (type === 1 || String(type).endsWith("01")) return "bud-table-row bud-table-row--header preserve-color unbreakable-block";
    if (type === 2 || String(type).endsWith("02")) return "bud-table-row table-spacer border-footer small-total-row unbreakable-block";
    if (type === 3 || String(type).endsWith("03")) return "bud-table-row table-spacer border-footer small-total-row unbreakable-block";
    if (type === 7 || String(type).endsWith("07")) return "bud-table-row bud-table-row--department unbreakable-block";
    return "bud-table-row normal-line unbreakable-block";
  };

  const toggleSection = (label) => {
    setCollapsedSections(prev => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <div className="bud-table-wrapper">
      <div className="bud-table" id="report-table">
        <div className="bud-table-header" style={{ borderLeft: "1px solid white", top: "52px" }}>
          <div className="bud-table-head bud-table-head--first bud-text-left" style={{ width: labelWidth }} />
          {years.map((year, i) => (
            <div key={i} className="bud-table-head bud-text-center" style={{ width: colWidth }}>
              {year}
            </div>
          ))}
        </div>

        {allLines.map((line, idx) => {
          const rowClass = getRowClass(line.type);
          const isHeader = line.type === 1;
          const isSmallTotal = line.type === 2 || String(line.type).endsWith("02");
          const isSectionTotal = line.type === 3 || String(line.type).endsWith("03");
          const isCollapsed = collapsedSections[line.label];

          if (isHeader) {
            return (
              <div
                key={line.label}
                className={rowClass}
                onClick={() => toggleSection(line.label)}
                style={{ cursor: "pointer" }}
              >
                <div className="bud-table-data" style={{ width: labelWidth }}>
                  {collapsedSections[line.label] ? "▶" : "▼"} {line.label.toUpperCase()}
                </div>
                {years.map((_, j) => (
                  <div key={j} className="bud-table-data bud-text-right" style={{ width: colWidth }} />
                ))}
              </div>
            );
          }

          const parentSection = allLines.find(l => l.type === 1 && line.label.startsWith(l.label));
          if (parentSection && collapsedSections[parentSection.label]) return null;

          return (
            <React.Fragment key={line.label}>
              {/* Separator before total rows */}
              {isSectionTotal && (
                <div
                  className="bud-table-small-total"
                  data-report-type="standard"
                  style={{ borderLeft: "1px solid white !important" }}
                >
                  <div className="bud-table-data bud-small-total-first" style={{ width: labelWidth }}></div>
                  {years.map((_, i) => (
                    <div
                      key={i}
                      className="bud-table-data sm-total-line-data"
                      style={{ width: colWidth }}
                    ></div>
                  ))}
                </div>
              )}

              <div className={rowClass}>
                <div className="bud-table-data" style={{ width: labelWidth }}>{line.label}</div>
                {years.map((year, i) => (
                  <div key={i} className="bud-table-data bud-text-right" style={{ width: colWidth }}>
                    {line.values[year] !== 0 && line.values[year] !== null
                      ? Number(line.values[year]).toLocaleString()
                      : "-"}
                  </div>
                ))}
              </div>

              {line.variation && (
                <div className="bud-table-row bud-global-variation-report-line">
                  <div className="bud-table-data" style={{ width: labelWidth }}>% of growth</div>
                  {years.map((_, i) => (
                    <div key={i} className="bud-table-data bud-text-right" style={{ width: colWidth }}>
                      {i === 0 ? "N/A" : line.variation}
                    </div>
                  ))}
                </div>
              )}

              {line.partOfRevenue && (
                <div className="bud-table-row bud-global-variation-report-line">
                  <div className="bud-table-data" style={{ width: labelWidth }}>% of revenue</div>
                  {years.map((_, i) => (
                    <div key={i} className="bud-table-data bud-text-right" style={{ width: colWidth }}>
                      {line.partOfRevenue}
                    </div>
                  ))}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ReportTable;
