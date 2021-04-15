QuestionnaireNameSwap(1)

function QuestionnaireNameSwap(increase) {
    // first swap
    for (var i = 0; i <= 500; i++) {
        try {
            var type = this.getField("Questionnaire.QUESTIONNAIRE_X" + i).type;
            if (type == "text") {
                var ts = this.getField("Questionnaire.QUESTIONNAIRE_X" + i).textSize;
                var tf = this.getField("Questionnaire.QUESTIONNAIRE_X" + i).textFont;
                var rct = this.getField("Questionnaire.QUESTIONNAIRE_X" + i).rect;
                var pg = this.getField("Questionnaire.QUESTIONNAIRE_X" + i).page;
                var f = this.addField("NewQuestionnaire.QUESTIONNAIRE_X" + i, type, pg, rct);
                f.textSize = ts;
                f.textFont = tf;
            } else if (type == "checkbox") {
                var count = this.getField("Questionnaire.QUESTIONNAIRE_X" + i).page.length
                if (count > 1) {
                    var vals = this.getField("Questionnaire.QUESTIONNAIRE_X" + i).exportValues;
                    var f;
                    for (var j = 0; j < count; j++) {
                        try {
                            var rct = this.getField("Questionnaire.QUESTIONNAIRE_X" + i + "." + j).rect;
                            var pg = this.getField("Questionnaire.QUESTIONNAIRE_X" + i + "." + j).page;
                            if (j == 0) {
                                f = this.addField("NewQuestionnaire.QUESTIONNAIRE_X" + i, type, pg, rct);
                            } else {
                                this.addField("NewQuestionnaire.QUESTIONNAIRE_X" + i, type, pg, rct);
                            }
                        } catch (e) { console.println(e) }
                    }
                    f.exportValues = vals;
                } else { // only one checkbox with this file
                    var rct = this.getField("Questionnaire.QUESTIONNAIRE_X" + i).rect;
                    var pg = this.getField("Questionnaire.QUESTIONNAIRE_X" + i).page;
                    var vals = this.getField("Questionnaire.QUESTIONNAIRE_X" + i).exportValues;
                    var f = this.addField("NewQuestionnaire.QUESTIONNAIRE_X" + i, type, pg, rct);
                    f.exportValues = vals;
                }
            }
        } catch (e) {}
    }
    this.removeField("Questionnaire");
    // second swap
    for (var i = 0; i <= 500; i++) {
        try {
            var type = this.getField("NewQuestionnaire.QUESTIONNAIRE_X" + i).type;
            if (type == "text") {
                var ts = this.getField("NewQuestionnaire.QUESTIONNAIRE_X" + i).textSize;
                var tf = this.getField("NewQuestionnaire.QUESTIONNAIRE_X" + i).textFont;
                var rct = this.getField("NewQuestionnaire.QUESTIONNAIRE_X" + i).rect;
                var pg = this.getField("NewQuestionnaire.QUESTIONNAIRE_X" + i).page;
                var f = this.addField("Questionnaire.QUESTIONNAIRE_X" + (i + increase), type, pg, rct);
                f.textSize = ts;
                f.textFont = tf;
            } else if (type == "checkbox") {
                var count = this.getField("NewQuestionnaire.QUESTIONNAIRE_X" + i).page.length
                if (count > 1) {
                    var vals = this.getField("NewQuestionnaire.QUESTIONNAIRE_X" + i).exportValues;
                    var f;
                    for (var j = 0; j < count; j++) {
                        try {
                            var rct = this.getField("NewQuestionnaire.QUESTIONNAIRE_X" + i + "." + j).rect;
                            var pg = this.getField("NewQuestionnaire.QUESTIONNAIRE_X" + i + "." + j).page;
                            if (j == 0) {
                                f = this.addField("Questionnaire.QUESTIONNAIRE_X" + (i + increase), type, pg, rct);
                            } else {
                                this.addField("Questionnaire.QUESTIONNAIRE_X" + (i + increase), type, pg, rct);
                            }
                        } catch (e) { console.println(e) }
                    }
                    f.exportValues = vals;
                } else { // only one checkbox with this file
                    var rct = this.getField("NewQuestionnaire.QUESTIONNAIRE_X" + i).rect;
                    var pg = this.getField("NewQuestionnaire.QUESTIONNAIRE_X" + i).page;
                    var vals = this.getField("NewQuestionnaire.QUESTIONNAIRE_X" + i).exportValues;
                    var f = this.addField("Questionnaire.QUESTIONNAIRE_X" + (i + increase), type, pg, rct);
                    f.exportValues = vals;
                }
            }
        } catch (e) {}
    }
    this.removeField("NewQuestionnaire");
}