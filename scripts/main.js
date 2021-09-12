"use strict";

(() => {
  const renderTableRow = (cellType, values) => {
    const row = $(`<tr>`);
    const rowContents = values.map(value => {
      const cellElement = $(`<${cellType}>`);
      cellElement.text(value);
      return cellElement;
    });

    row.append(rowContents);

    return row;
  };

  const renderTableHeadRow = values => renderTableRow("th", values);
  const renderTableBodyRow = values => renderTableRow("td", values);

  const renderTable = ([tableHead, ...tableBody]) => {
    const tableElement = $("<table>");
    const renderedTableBody = tableBody.map(renderTableBodyRow);

    tableElement.append(renderTableHeadRow(tableHead));
    tableElement.append(renderedTableBody);

    return tableElement;
  };

  const renderTables = (container, tables) => {
    const renderedTables = tables.map(renderTable);
    container.html(renderedTables);
  };

  const renderSchemas = schemas => {
    const schemaTables = schemas.map(([schemaName, schema]) => [[schemaName, ""], ...schema]);
    renderTables($(".schemas"), schemaTables);
  };

  const renderQueryResults = queryResults => {
    const queryResultTables = queryResults.map(([head, body]) => [head, ...body]);
    return renderTables($(".query-results"), queryResultTables);
  };

  $(document).ready(() => {
    const userSchema = [
      ["id", "UUID"],
      ["username", "VARCHAR(32)"],
      ["password_hash", "CHAR(64)"],
      ["full_name", "VARCHAR(128)"]
    ];
    const queryResult = [
      ["id", "username", "password_hash", "full_name"],
      [["f67cec3a-a11f-43e4-a1ba-9e31b5986868",
        "jd0e",
        "69b0293f0d853cfee5f9f5877cd2f4556a9ff3d21f21344b055137792dd40cea",
        "John Doe"],
       ["167b28c0-106d-4380-ac83-bda04c200015",
        "jane.doe",
        "5e468727aec056db63824327c19b96827b627c011b09ad88fd23511edf5ec9d8",
        "Jane Doe"]]
    ];

    renderSchemas([["User", userSchema]]);
    renderQueryResults([queryResult]);
  });
})();