import { TestClass2 } from "./sub/subaction1";
import defaultExport, * as nsImport from "./sub/subaction1";
import defaultExport2, { default as defNamed } from "./sub/subaction1";
import "buffer";
export { TestClass2 };
export { nsImport as namedImport };
export default defNamed;
export { defaultExport as def1, defaultExport2 as def2 };
