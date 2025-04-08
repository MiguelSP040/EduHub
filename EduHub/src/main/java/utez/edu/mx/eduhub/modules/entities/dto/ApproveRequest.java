package utez.edu.mx.eduhub.modules.entities.dto;

public class ApproveRequest {
    private String rejectReason;

    public ApproveRequest(String rejectReason) {
        this.rejectReason = rejectReason;
    }

    public String getRejectReason() {
        return rejectReason;
    }

    public void setRejectReason(String rejectReason) {
        this.rejectReason = rejectReason;
    }
}
