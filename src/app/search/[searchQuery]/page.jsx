import FoundBooks from "../../modules/FoundBooks/FoundBooks"

const searchPage = async ({ params }) => {
    const { searchQuery } = await params
    return (
        <FoundBooks searchQuery={searchQuery} />
    )
}

export default searchPage