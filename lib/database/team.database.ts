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

export const getTeamMemberByTeamId = async (teamId: number) => {
  try {
    const { rows } = await sql`
      SELECT id,name,email,image,phone,role from users where team_id = ${teamId};
    `;

    if (rows.length > 0) {
      return rows;
    }
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
            
                latest_scores.explore,
                latest_scores.analyze,
                latest_scores.design,
                latest_scores.optimize,
                latest_scores.connect,
                latest_scores.nurture,
                latest_scores.energize,
                latest_scores.achieve
            
            FROM users
            
            LEFT JOIN (
                SELECT
                    scores.user_id,
                    scores.explore,
                    scores.analyze,
                    scores.design,
                    scores.optimize,
                    scores.connect,
                    scores.nurture,
                    scores.energize,
                    scores.achieve,
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

export const checkTeamThinkingStyleScore = async (teamMembers: number[]) => {
  try {
    const placeholders = teamMembers.map((_, index) => `$${index + 1}`).join(", ");
    const query = `
  SELECT DISTINCT user_id 
  FROM scores 
  WHERE user_id IN (${placeholders})
`;

    const { rows } = await sql.query(query, teamMembers);

    if (rows.length >= 3) {
      return rows;
    }
    return null;
  } catch (error) {
    console.error("errrr");
    console.error(error);
    return null;
  }
};

export const deleteTeamById = async (teamId: number) => {
  try {
    // Start transaction
    await sql`BEGIN`;

    // Reset team_id in users table
    await sql`
      UPDATE users SET team_id = NULL WHERE team_id = ${teamId}
    `;

    // Delete the team
    const result = await sql`
      DELETE FROM teams WHERE id = ${teamId}
    `;

    // Commit the transaction
    await sql`COMMIT`;

    return result.rowCount > 0;
  } catch (error) {
    // Rollback the transaction in case of an error
    await sql`ROLLBACK`;
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
