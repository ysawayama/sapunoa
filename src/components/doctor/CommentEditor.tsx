import { useState, useEffect } from 'react';
import { doctorService } from '@/services/doctor.service';
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

interface CommentEditorProps {
  patientId: string;
}

interface Comment {
  id: string;
  content: string;
  doctorName: string;
  createdAt: string;
  updatedAt: string;
}

export default function CommentEditor({ patientId }: CommentEditorProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [patientId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getPatientComments(patientId);
      setComments(data);
    } catch (err) {
      setError('Failed to fetch comments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      await doctorService.addPatientComment(patientId, newComment);
      setNewComment('');
      setSuccessMessage('Comment added successfully');
      
      // Refresh comments after adding
      await fetchComments();
    } catch (err) {
      setError('Failed to add comment');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await doctorService.deletePatientComment(patientId, commentId);
      await fetchComments();
    } catch (err) {
      setError('Failed to delete comment');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Comment</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your medical notes or observations..."
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={addComment}
              disabled={saving || !newComment.trim()}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add Comment'}
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Previous Comments</h3>
        {comments.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No comments yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-1" />
                        {comment.doctorName}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-900 whitespace-pre-wrap">{comment.content}</p>
                    {comment.updatedAt !== comment.createdAt && (
                      <p className="mt-2 text-xs text-gray-500">
                        Edited: {new Date(comment.updatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="ml-4 text-sm text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}