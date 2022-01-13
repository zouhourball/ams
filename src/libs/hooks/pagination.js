export const nextPage = (data, [page, setPage]) => {
  const totalPages = data?.totalPages
  if (page < totalPages - 1) {
    setPage((page) => page + 1)
  }
}
export const prevPage = ([page, setPage]) => {
  if (page > 0) {
    setPage((page) => page - 1)
  }
}
