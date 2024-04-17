const fetchStringInfo = async ({token}: {token: string}) => {
    try {
        const url = `${process.env.STRING_INFO_URL}/${token}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.message == "Token doesn't exist") {
           return { name: "Not Found" };
        }
        return data;
    } catch (error) {
        console.error("Failed to fetch string info:", error);
    }
};

export default fetchStringInfo;