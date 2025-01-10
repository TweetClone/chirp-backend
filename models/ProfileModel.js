const editProfile = `
  UPDATE app_user
  SET "displayName" = $1,"birthDate" = $2, "bio" = $3
  WHERE "userId" = $4;
`;

const getUserPosts = `
  WITH post_likes AS (
    SELECT
      "postId", 
      COUNT(*)::INT AS "numberOfLikes"
    FROM liked_post
    WHERE "postId" IN (SELECT "postId" FROM post WHERE deleted = FALSE)
    GROUP BY "postId"
  ),
  post_replies_reposts AS (
    SELECT
      "parentPostId",
      COUNT(*)::INT AS "numberOfReplies",
      COUNT(CASE WHEN "isRepost" = TRUE THEN 1 END) AS "numberOfReposts"
    FROM post
    WHERE "parentPostId" IS NOT NULL
      AND deleted = FALSE
    GROUP BY "parentPostId"
  )
  SELECT 
    p."postId",
    u.username,
    u."displayName",
    p."textContent",
    p.timestamp,
    u."userId",
    p."editedTimestamp",
    EXISTS (
      SELECT 1 
      FROM liked_post li 
      WHERE li."userId" = u."userId"
        AND li."postId" = p."postId" 
      LIMIT 1
    ) AS "isLikedByCurrentUser",
    COALESCE(l."numberOfLikes", 0) AS "numberOfLikes",
    COALESCE(r."numberOfReplies", 0) AS "numberOfReplies",
    COALESCE(r."numberOfReposts", 0) AS "numberOfReposts"
  FROM post AS p
  LEFT JOIN post_likes AS l
    ON p."postId" = l."postId"
  LEFT JOIN post_replies_reposts AS r
    ON p."postId" = r."parentPostId"
  INNER JOIN app_user AS u
    ON p."userId" = u."userId"
  WHERE u."userId" = $1
    AND p."parentPostId" IS NULL
    AND p.deleted = FALSE
  ORDER BY p.timestamp DESC;
`;

const getUserReplies = `
  WITH post_likes AS (
    SELECT
      "postId", 
      COUNT(*)::INT AS "numberOfLikes"
    FROM liked_post
    WHERE "postId" IN (SELECT "postId" FROM post WHERE deleted = FALSE)
    GROUP BY "postId"
  ),
  post_replies_reposts AS (
    SELECT
      "parentPostId",
      COUNT(*)::INT AS "numberOfReplies",
      COUNT(CASE WHEN "isRepost" = TRUE THEN 1 END) AS "numberOfReposts"
    FROM post
    WHERE "parentPostId" IS NOT NULL
      AND deleted = FALSE
    GROUP BY "parentPostId"
  )
  SELECT 
    p."postId",
    u.username,
    u."displayName",
    p."textContent",
    p.timestamp,
    u."userId",
    EXISTS (
      SELECT 1 
      FROM liked_post li 
      WHERE li."userId" = u."userId" 
        AND li."postId" = p."postId" 
      LIMIT 1
    ) AS "isLikedByCurrentUser",
    COALESCE(l."numberOfLikes", 0) AS "numberOfLikes",
    COALESCE(r."numberOfReplies", 0) AS "numberOfReplies",
    COALESCE(r."numberOfReposts", 0) AS "numberOfReposts"
  FROM post AS p
  LEFT JOIN post_likes AS l
    ON p."postId" = l."postId"
  LEFT JOIN post_replies_reposts AS r
    ON p."postId" = r."parentPostId"
  INNER JOIN app_user AS u
    ON p."userId" = u."userId"
  WHERE u."userId" = $1 
    AND p."parentPostId" IS NOT NULL
    AND p.deleted = FALSE
  ORDER BY p.timestamp DESC;
`;

const getUserLikes = `
  WITH post_likes AS (
    SELECT
      "postId", 
      COUNT(*)::INT AS "numberOfLikes"
    FROM liked_post
    WHERE "postId" IN (SELECT "postId" FROM post WHERE deleted = FALSE)
    GROUP BY "postId"
  ),
  post_replies_reposts AS (
    SELECT
      "parentPostId",
      COUNT(*)::INT AS "numberOfReplies",
      COUNT(CASE WHEN "isRepost" = TRUE THEN 1 END) AS "numberOfReposts"
    FROM post
    WHERE "parentPostId" IS NOT NULL
      AND deleted = FALSE
    GROUP BY "parentPostId"
  )
  SELECT 
    p."postId",
    u.username,
    u."displayName",
    p."textContent",
    p.timestamp,
    u."userId",
    TRUE AS "isLikedByCurrentUser",
    COALESCE(l."numberOfLikes", 0) AS "numberOfLikes",
    COALESCE(r."numberOfReplies", 0) AS "numberOfReplies",
    COALESCE(r."numberOfReposts", 0) AS "numberOfReposts"
  FROM post AS p
  INNER JOIN app_user AS u
    ON p."userId" = u."userId"
  LEFT JOIN post_likes AS l
    ON p."postId" = l."postId"
  LEFT JOIN post_replies_reposts AS r
    ON p."postId" = r."parentPostId"
  WHERE EXISTS (
    SELECT 1
    FROM liked_post li
    INNER JOIN app_user AS u
      ON li."userId" = u."userId"
    WHERE u."userId" = $1
      AND li."postId" = p."postId"
  )
    AND p.deleted = FALSE
  ORDER BY p.timestamp DESC;
`;

const getProfileContents = `
  SELECT 
    (
      SELECT
        COUNT(*)
        FROM post
        WHERE "userId" = a."userId" AND deleted = FALSE
    ) AS "postCount",
    a."bio",
    a."joinedDate",
    a."displayName",
    a."username",
    a."birthDate",
    a."userId",
    (
      SELECT
        COUNT(*)
      FROM follow
      WHERE "followedUserId" = a."userId"
    ) AS "followerCount",
    (
      SELECT
        COUNT(*)
      FROM follow
      WHERE "followerUserId" = a."userId"
    ) AS "followingCount",
    CASE
      WHEN EXISTS (
        SELECT 1
        FROM follow WHERE "followerUserId" = $1
          AND "followedUserId" = a."userId"
      )
      THEN TRUE
      ELSE FALSE
    END AS "isFollowing"
  FROM app_user AS a
  WHERE a."username" = $2;
`;

module.exports = {
  editProfile,
  getUserPosts,
  getUserReplies,
  getUserLikes,
  getProfileContents,
};
