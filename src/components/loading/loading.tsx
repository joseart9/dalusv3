import { Spinner } from "../spinner";

export function Loading() {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <Spinner />
    </div>
  );
}
