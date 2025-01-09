$(function() {
    // Add current filter state
    let currentFilter = 'all';

    // Modified loadIssues function to use current filter
    function loadIssues() {
        const url = currentFilter === 'all' 
            ? '/api/issues/apitest' 
            : `/api/issues/apitest?open=${currentFilter === 'open' ? 'true' : 'false'}`;
        
        $.get(url, function(issues) {
            const issuesHtml = issues.map(issue => `
                <div class="col-md-6 mb-3">
                    <div class="card h-100 ${issue.open ? 'border-primary' : 'border-secondary'}">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h6 class="mb-0">${issue.issue_title}</h6>
                            <span class="badge ${issue.open ? 'bg-primary' : 'bg-secondary'}">${issue.open ? 'Open' : 'Closed'}</span>
                        </div>
                        <div class="card-body">
                            <p class="small text-muted mb-2">ID: ${issue._id}</p>
                            <p class="card-text">${issue.issue_text}</p>
                            <hr>
                            <div class="small">
                                <p class="mb-1"><strong>Created by:</strong> ${issue.created_by}</p>
                                <p class="mb-1"><strong>Assigned to:</strong> ${issue.assigned_to}</p>
                                <p class="mb-1"><strong>Status text:</strong> ${issue.status_text}</p>
                                <p class="mb-1"><strong>Created:</strong> ${new Date(issue.created_on).toLocaleString()}</p>
                                <p class="mb-1"><strong>Last updated:</strong> ${new Date(issue.updated_on).toLocaleString()}</p>
                            </div>
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-sm btn-warning edit-issue" data-id="${issue._id}">Edit</button>
                            <button class="btn btn-sm btn-danger delete-issue" data-id="${issue._id}">Delete</button>
                        </div>
                    </div>
                </div>
            `).join('');
            $('#issuesList').html(issuesHtml);
        });
    }

    // Form handlers
    $('#testForm').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/issues/apitest',
            type: 'post',
            data: $(this).serialize(),
            success: function(data) {
                // Reset form to default values
                $('#testForm')[0].reset();
                $('#testForm input[name="issue_title"]').val('New Issue');
                $('#testForm input[name="created_by"]').val('Admin');
                $('#testForm textarea[name="issue_text"]').val('Please describe the issue');
                $('#testForm input[name="assigned_to"]').val('Unassigned');
                $('#testForm input[name="status_text"]').val('In QA');
                
                loadIssues();
                $('#createIssueForm').collapse('hide');
            },
            error: function(err) {
                alert('Error creating issue: ' + err.responseText);
            }
        });
    });

    // Issue actions
    $(document).on('click', '.edit-issue', function() {
        const issueId = $(this).data('id');
        $.get('/api/issues/apitest', { _id: issueId }, function(issues) {
            if (issues && issues.length > 0) {
                const issue = issues[0];
                const modal = $('#updateIssueModal');
                modal.find('[name="_id"]').val(issue._id);
                modal.find('[name="issue_title"]').val(issue.issue_title);
                modal.find('[name="issue_text"]').val(issue.issue_text);
                modal.find('[name="assigned_to"]').val(issue.assigned_to);
                modal.find('[name="status_text"]').val(issue.status_text);
                modal.find('[name="open"]').prop('checked', !issue.open);
                modal.modal('show');
            }
        });
    });

    $('#updateIssueBtn').click(function() {
        const form = $('#updateIssueForm');
        const issueId = form.find('[name="_id"]').val();
        
        const isOpen = !form.find('[name="open"]').is(':checked');
        const formData = form.serialize() + (isOpen ? '&open=true' : '&open=false');

        $.ajax({
            url: '/api/issues/apitest',
            type: 'put',
            data: formData,
            success: function(data) {
                $('#updateIssueModal').modal('hide');
                form[0].reset();
                loadIssues();
            },
            error: function(err) {
                alert('Error updating issue: ' + err.responseText);
            }
        });
    });

    $(document).on('click', '.delete-issue', function() {
        if (confirm('Are you sure you want to delete this issue?')) {
            const issueId = $(this).data('id');
            $.ajax({
                url: '/api/issues/apitest',
                type: 'delete',
                data: { _id: issueId },
                success: function(data) {
                    loadIssues();
                }
            });
        }
    });

    // Filter handling
    $('.btn-group [data-filter]').click(function() {
        $(this).addClass('active').siblings().removeClass('active');
        currentFilter = $(this).data('filter');
        loadIssues();
    });

    // Modal events
    $('#updateIssueModal').on('hidden.bs.modal', function() {
        $('#updateIssueForm')[0].reset();
    });

    // Initial load
    loadIssues();
});
