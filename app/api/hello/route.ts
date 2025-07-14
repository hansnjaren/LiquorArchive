/**
 * @openapi
 * /api/hello:
 *   get:
 *     summary: Hello 테스트
 *     description: 인증 없이 “Hello!”를 반환합니다.
 *     tags:
 *       - Test
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Hello from API!
 */
export async function GET() {
  return new Response(JSON.stringify({ msg: "Hello from API!" }), {
    headers: { "Content-Type": "application/json" },
  });
}
