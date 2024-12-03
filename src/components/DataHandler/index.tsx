import { ReactNode } from "react";
import { Box, Typography, Skeleton } from "@mui/material";

const LoadingSkeleton = (
  <>
    {[...Array(3)].map((_, index) => (
      <Skeleton
        key={index}
        variant="rectangular"
        width="350px"
        height="300px"
        sx={{ bgcolor: "#1C1F22 !important", borderRadius: "10px" }}
      />
    ))}
  </>
);

const EmptyData = (
  <Box
    sx={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Typography variant="h5" color="gray">
      No Data Found
    </Typography>
  </Box>
);

interface DataHandlerProps<T> {
  data: T[] | null | undefined;
  loadingComponent?: ReactNode;
  emptyStateComponent?: ReactNode;
  renderData: (data: T[]) => ReactNode;
}

const DataHandler = <T,>({
  data,
  loadingComponent = LoadingSkeleton,
  emptyStateComponent = EmptyData,
  renderData,
}: DataHandlerProps<T>) => {
  if (data === null || data === undefined) {
    return <>{loadingComponent}</>;
  }

  if (data.length === 0) {
    return <>{emptyStateComponent}</>;
  }

  return <>{renderData(data)}</>;
};

export default DataHandler;
