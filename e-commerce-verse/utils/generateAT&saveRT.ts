import User from "@/models/user.model";

interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

export const generateAccessAndRefreshToken = async (userId: string): Promise<TokenResponse> => {
    try {
        const user = await User.findById(userId);
        
        if (!user) {
            throw new Error("User not found");
        }

        const accessToken = await user.getAccessToken();
        const refreshToken = await user.getRefreshToken();
        
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error("Error generating tokens");
    }
};