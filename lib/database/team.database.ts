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
              SELECT t.id as team_id,
                  t.name as team_name,
                  t.description as team_description,
                  t.admin_id as team_admin_id,
                  t.image as team_image,
                  u.id as user_id,
                  u.name as user_name,
                  u.email as user_email,
                  u.phone as user_phone,
                  u.role as user_role,
                  s.id as score_id,
                  s.explorer as explorer,
                  s.analyst as analyst,
                  s.designer as designer,
                  s.optimizer as optimizer,
                  s.connector as connector,
                  s.nurturer as nurturer,
                  s.energizer as energizer,
                  s.achiever as achiever
              FROM users u
              LEFT JOIN scores s ON (
              s.user_id = u.id
                 AND NOT EXISTS (
                   SELECT 1 FROM scores s1
                   WHERE s1.id = s.id
                     AND s1.id > u.id
                 )
              )
              join teams t on t.id = u.team_id
              WHERE u.team_id = 5;
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
