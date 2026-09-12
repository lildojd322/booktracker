import Profile from "../../modules/profile/profile"



export async function generateMetadata({ params }) {
    const { username } = await params
    const decodedUsername = decodeURIComponent(username)

    return {
        title: `${decodedUsername} `,
        description: `User profile page`
    }
}

const UserProfile = () => {
    return (
        <div>
            <Profile />
        </div>
    )
}

export default UserProfile