export function Paginate(data, currentPage, itemsPerPage) {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.length > 0 ? data.slice(indexOfFirstItem, indexOfLastItem): [];
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return {
    currentItems,
    totalPages,
  }
}
