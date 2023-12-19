
import { sql } from "@vercel/postgres";


export const verifyTeamToken = async (token: string) =>  {
    try {
        const {rows} = await sql`
        SELECT * FROM teams WHERE invite_token = ${token}
    `;

        if(rows.length > 0) {
            const team = rows[0];
            if(team.invite_token_expiry > new Date()){
                return team;
            }
        }
        return null;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}