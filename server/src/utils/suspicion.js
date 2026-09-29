export const POINTS = { TAB_SWITCH:3, FULLSCREEN_EXIT:2, PASTE:2, COPY:1, CUT:1, RIGHT_CLICK:1, DEVTOOLS:2, NO_FACE:3, MULTIPLE_FACES:5, FACE_RETURN:0 };
export const riskFor = score => score >= 15 ? 'CRITICAL' : score >= 10 ? 'HIGH' : score >= 5 ? 'MEDIUM' : 'LOW';
