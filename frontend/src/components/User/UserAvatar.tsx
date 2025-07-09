function UserAvatar({ username }: { username: string | null }) {
    return (
        <img
            src={`https://ui-avatars.com/api/?name=${username}&background=random`}
            alt="Profile"
            className="w-8 rounded-full object-cover"
        />
    );
}

export default UserAvatar;
