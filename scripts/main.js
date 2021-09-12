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

  const showSchema = db => {
    const schemaResults = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
    const tableNames = schemaResults[0].values.map(([tableName]) => tableName);
    const schemas = tableNames.map(tableName => {
      const tableInfoResults = db.exec(`pragma table_info(${tableName})`);
      const tableInfo = tableInfoResults[0];
      const nameIndex = tableInfo.columns.indexOf("name");
      const typeIndex = tableInfo.columns.indexOf("type");
      const schemaBody = tableInfo.values.map(tableInfoRow => {
        const name = tableInfoRow[nameIndex];
        const type = tableInfoRow[typeIndex];
        return [name, type];
      });

      return [tableName, schemaBody];
    });

    renderSchemas(schemas);
  };

  const visualizeSql = (SQL, code) => {
    const db = new SQL.Database();
    const result = db.exec(code);
    const queryResults = result.map(({columns, values}) => [columns, values]);

    renderQueryResults(queryResults);
    showSchema(db);
  };

  $(document).ready(() => {
    const sqlJsConfig = { locateFile: filename => `scripts/${filename}` };
    initSqlJs(sqlJsConfig).then(SQL => {
      $("#run-sql-form").on("submit", function() {
        const code = $(this.elements["sql-code"]).val();
        visualizeSql(SQL, code);
        return false;
      });
    });
  });
})();