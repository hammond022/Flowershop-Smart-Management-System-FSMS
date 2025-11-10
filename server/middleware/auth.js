import { db } from "../server.js";

export async function basicAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.set("WWW-Authenticate", 'Basic realm="Protected Area"');
    return res
      .status(401)
      .json({ message: "Missing or invalid Authorization header" });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const [username, password] = Buffer.from(base64Credentials, "base64")
    .toString("utf-8")
    .split(":");
  await db.read();
  const user = db.data.users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    res.set("WWW-Authenticate", 'Basic realm="Protected Area"');
    return res.status(401).json({ message: "Invalid credentials" });
  }

  req.user = user;
  next();
}
