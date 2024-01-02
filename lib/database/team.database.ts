import { sql } from "@vercel/postgres";

export const verifyTeamToken = async (token: string) => {
  try {
    const { rows } = await sql`
        SELECT * FROM teams WHERE invite_token = ${token}
    `;

    if (rows.length > 0) {
      const team = rows[0];
      if (team.invite_token_expiry > new Date()) {
        return team;
      }
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getTeamById = async (teamId: number) => {
  try {
    const { rows } = await sql`
        SELECT * FROM teams WHERE id = ${teamId}
    `;

    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getTeamByUser = async (userId: number) => {
  try {
    const { rows } = await sql`
            select teams.* from teams join users on users.team_id = teams.id where users.id = ${userId};
        `;

    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteTeamById = async (teamId: number) => {
  try {
    const result = await sql`
            DELETE FROM teams WHERE id = ${teamId}
        `;

    return result.rowCount > 0;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getTeamScore = async (teamId: number) => {
  try {
    const { rows } = await sql`
            SELECT
                users.id AS user_id,
                users.name AS user_name,
                users.email AS user_email,
                users.image AS user_image,
                users.role AS user_role,
                users.team_id AS user_team_id,
            
                latest_scores.explorer,
                latest_scores.analyst,
                latest_scores.designer,
                latest_scores.optimizer,
                latest_scores.connector,
                latest_scores.nurturer,
                latest_scores.energizer,
                latest_scores.achiever
            
            FROM users
            
            LEFT JOIN (
                SELECT
                    scores.user_id,
                    scores.explorer,
                    scores.analyst,
                    scores.designer,
                    scores.optimizer,
                    scores.connector,
                    scores.nurturer,
                    scores.energizer,
                    scores.achiever,
                    scores.created_at,
                    scores.updated_at,
                    ROW_NUMBER() OVER(PARTITION BY scores.user_id ORDER BY scores.created_at DESC) AS rn
                FROM scores
            ) AS latest_scores ON users.id = latest_scores.user_id AND latest_scores.rn = 1
            
            where users.team_id = ${teamId}
            ORDER BY users.team_id, users.id;
        `;

    if (rows.length > 0) {
      return rows;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateTeamByAdminID = async (team: any, adminId: number) => {
  try {
    const result = await sql`
        UPDATE teams SET name = COALESCE(${team?.name},name), description = COALESCE(${team?.description}, description), 
        image = COALESCE(${team?.image}, image) WHERE admin_id = ${adminId}
      `;
    return result.rowCount > 0;
  } catch (error) {
    console.error(error);
    return null;
  }
};
