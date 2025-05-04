import * as z from "zod";

export const SignInSchema = z.object({
  username: z.string().nonempty("Vui lòng điền vào mục này"),
  password: z
    .string()
    .nonempty("Vui lòng điền vào mục này"),
});
