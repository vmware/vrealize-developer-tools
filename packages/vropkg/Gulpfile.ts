import * as fs from "fs-extra";
import * as gulp from "gulp";
import * as tsc from "gulp-typescript";
import * as path from 'path';
const jasmine = require("gulp-jasmine");

gulp.task("clean", async () => {
	await fs.remove("dist");
	await fs.remove(path.join('test', 'target-flat'))
	await fs.remove(path.join('test', 'target-flat.tmp'))
	await fs.remove(path.join('test', 'target-tree'))
	await fs.remove(path.join('test', 'com.vmware.pscoe.toolchain-expand'))
});

gulp.task("compile-prod", done => {
	return compile({
		declaration: true,
		removeComments: true
	});
});

gulp.task("package-prod", gulp.series(["compile-prod", () => {
	return gulp.src("conf/tsconfig.merge.json")
		.pipe(gulp.dest("dist"));
}]));

gulp.task("compile-e2e", (done) => {
	let project = tsc.createProject("conf/tsconfig.e2e.json", {
		declaration: true,
	});

	return project.src()
		.pipe(project())
		.pipe(gulp.dest("build/e2e/"));
});

gulp.task("test-e2e", gulp.series([
	"compile-prod",
	"compile-e2e",
	() => gulp.src("build/e2e/*.js")
		.pipe(jasmine({
			verbose: true,
			includeStackTrace: true
		}))
]));

gulp.task("build-prod", gulp.series(["package-prod", "test-e2e"]));

gulp.task("default", gulp.series(["clean", "build-prod"]));

function compile(settings: tsc.Settings): NodeJS.ReadWriteStream {
	let project = tsc.createProject("conf/tsconfig.json", settings);
	let stream = project.src();

	return stream.pipe(project()).pipe(gulp.dest("dist"));
}
