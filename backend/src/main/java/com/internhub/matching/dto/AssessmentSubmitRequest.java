package com.internhub.matching.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Request body for POST /api/student/apply/{internshipId}.
 * assessmentScore is optional — null means the student did not complete the quiz.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentSubmitRequest {

    /** AI skill quiz score (0–15). May be null if assessment was not completed. */
    private Integer assessmentScore;
}
