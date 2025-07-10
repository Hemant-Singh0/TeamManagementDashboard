import { useMemo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Icon from "@mui/material/Icon";
import MDBox from "../../../utils/MDBox";
import MDPagination from "../../../utils/MDPagination";
import DataTableHeadCell from "./DataTableHeadCell";
import DataTableBodyCell from "./DataTableBodyCell";
import { TableCell, Typography } from "@mui/material";

function DataTable({
  entriesPerPage,
  canSearch,
  showTotalEntries,
  table,
  pagination,
  isSorted,
  noEndBorder,
  setSearchTerm,
  searchTerm,
  name,
}) {
  const defaultValue = entriesPerPage.defaultValue || 25;
  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => table.rows, [table]);

  const [lastValidPageIndex, setLastValidPageIndex] = useState(0);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      autoResetPage: false,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    pageOptions,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  useEffect(() => setPageSize(defaultValue || 10), [defaultValue]);
  useEffect(() => {
    if (pageOptions.length > 0 && pageIndex >= pageOptions.length) {
      gotoPage(Math.max(pageOptions.length - 1, 0));
    } else if (pageOptions.length > 0) {
      setLastValidPageIndex(pageIndex);
    }
  }, [pageOptions.length, pageIndex, gotoPage]);

  const renderPagination = () => {
    const totalPages = pageOptions.length;
    const visiblePages = [];
    const maxVisible = 3;
    const start = Math.max(0, pageIndex - 1);
    const end = Math.min(totalPages, start + maxVisible);

    if (pageIndex > 1) {
      visiblePages.push(
        <MDPagination item key="first" onClick={() => gotoPage(0)}>
          1
        </MDPagination>
      );
      if (pageIndex > 2) {
        visiblePages.push(
          <MDPagination item key="start-ellipsis" disabled>
            ...
          </MDPagination>
        );
      }
    }

    for (let i = start; i < end; i++) {
      visiblePages.push(
        <MDPagination item key={i} onClick={() => gotoPage(i)} active={pageIndex === i}>
          {i + 1}
        </MDPagination>
      );
    }

    if (end < totalPages - 1) {
      visiblePages.push(
        <MDPagination item key="end-ellipsis" disabled>
          ...
        </MDPagination>
      );
    }

    if (end < totalPages) {
      visiblePages.push(
        <MDPagination item key="last" onClick={() => gotoPage(totalPages - 1)}>
          {totalPages}
        </MDPagination>
      );
    }

    return visiblePages;
  };

  const setSortedValue = (column) => {
    if (!isSorted) return false;
    if (column.isSorted) return column.isSortedDesc ? "desc" : "asce";
    return "none";
  };

  return (
    <TableContainer sx={{ boxShadow: "none" }}>
      {canSearch && (
        <MDBox display="flex" justifyContent="flex-end">
          <input
            type="text"
            value={searchTerm || ""}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${name}...`}
            style={{
              width: "250px",
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "14px",
            }}
          />
        </MDBox>
      )}
      <Table {...getTableProps()}>
        <MDBox component="thead">
          {headerGroups.map((headerGroup, key) => (
            <TableRow key={key} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, idx) => (
                <DataTableHeadCell
                  key={idx}
                  {...column.getHeaderProps(isSorted && column.getSortByToggleProps())}
                  width={column.width || "auto"}
                  align={column.align || "left"}
                  sorted={setSortedValue(column)}
                >
                  {column.render("Header")}
                </DataTableHeadCell>
              ))}
            </TableRow>
          ))}
        </MDBox>

        <TableBody {...getTableBodyProps()}>
          {page.length > 0 ? (
            page.map((row, key) => {
              prepareRow(row);
              return (
                <TableRow key={key} {...row.getRowProps()}>
                  {row.cells.map((cell, idx) => (
                    <DataTableBodyCell
                      key={idx}
                      noBorder={noEndBorder && rows.length - 1 === key}
                      align={cell.column.align || "left"}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </DataTableBodyCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No matching data found.
                  </Typography>
                </TableCell>
              </TableRow>
          )}
        </TableBody>
      </Table>

      <MDBox
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        p={!showTotalEntries && pageOptions.length === 1 ? 0 : 3}
      >
        {showTotalEntries && data.length > 0 && (
          <MDBox mb={{ xs: 3, sm: 0 }}>
            <p>
              Showing {page.length} of {data.length} entries
            </p>
          </MDBox>
        )}

        {pageOptions.length > 1 && (
          <MDPagination
            variant={pagination.variant || "gradient"}
            color={pagination.color || "info"}
          >
            {canPreviousPage && (
              <MDPagination item onClick={() => previousPage()}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
              </MDPagination>
            )}

            {renderPagination()}

            {canNextPage && (
              <MDPagination item onClick={() => nextPage()}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
              </MDPagination>
            )}
          </MDPagination>
        )}
      </MDBox>
    </TableContainer>
  );
}

DataTable.defaultProps = {
  entriesPerPage: { defaultValue: 10, entries: [5, 10, 15, 20, 25] },
  canSearch: false,
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
};

DataTable.propTypes = {
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.shape({
      defaultValue: PropTypes.number,
      entries: PropTypes.arrayOf(PropTypes.number),
    }),
    PropTypes.bool,
  ]),
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.objectOf(PropTypes.array).isRequired,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "gradient"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
  }),
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
  setSearchTerm: PropTypes.func,
  searchTerm: PropTypes.string,
  name: PropTypes.string,
  pagination: PropTypes.bool,
};

export default DataTable;