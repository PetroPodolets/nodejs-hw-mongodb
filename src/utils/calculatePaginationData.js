export const calculatePaginationData = ({ total, page, perPage }) => {
    const totalPages = Math.ceil((total / perPage))
    const hasNextPages = page < totalPages;
    const hasPreviousPages = page > 1;

    console.log(page)
    console.log(perPage)
    console.log(total)
    console.log("sfdfadfasfasdf", totalPages)
    console.log(hasNextPages)
    console.log(hasPreviousPages)

    return {
        totalPages,
        hasNextPages,
        hasPreviousPages,
    }
};
