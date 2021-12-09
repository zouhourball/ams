let companyBlockMap = {}

export function updateCompanyBlockMap (companies) {
  if (companies) {
    companyBlockMap = companies.reduce(
      (pre, company) => ({
        ...pre,
        [company.name.toUpperCase()]: company.blocs.map((b) => b.blocName),
      }),
      {},
    )
  }
}

export function getCompanyBlockMap () {
  return companyBlockMap
}
