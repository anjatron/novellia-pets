import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	globalIgnores([
		".next/**",
		"out/**",
		"build/**",
		"next-env.d.ts",
		"node_modules/**",
		"prisma/**",
		"app/generated/**",
		"docker/**",
		"app/components/ui/**",
		"lib/hooks/use-mobile.ts", // created by shadcn
	]),
	prettierConfig, // disables conflicting ESLint rules, must be after other configs
	{
		plugins: { prettier },
		rules: {
			"prettier/prettier": "warn",
		},
	},
]);

export default eslintConfig;
