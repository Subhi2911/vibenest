import React from 'react'
import ReactQuill from 'react-quill';

const Notify = () => {
    const categories = [
        'Technology',
        'Health & Wellness',
        'Travel & Adventure',
        'Lifestyle',
        'Finance & Business',
        'Food & Recipes',
        'Education & Learning',
        'Entertainment & Culture',
        'Spiritual'
    ];
    return (
        <div>

            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>


            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Cover Image</label>
                            <input type="file" className="form-control" />
                            <button className="btn btn-secondary mt-2" >
                                Upload Cover
                            </button>
                            
                                
                        </div>
                        <div className="mb-3">
                            <div>
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    name="ecategory"
                                    //value={blog.ecategory}
                                    //onChange={onChange}
                                    required
                                    style={{ border: '1px solid red', background: 'white' }}
                                >

                                    <option value="">Select a category</option>
                                    {categories.map((cat, index) => (
                                        <option value={cat} key={index}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Blog Title</label>
                            <input
                                type="text"
                                className="form-control"
                                name="etitle"
                                minLength={5}
                                maxLength={100}
                                //value={blog.etitle}
                                //onChange={onChange}
                                placeholder="Enter blog title"
                            />
                           
                        </div>


                        <div className="mb-3">
                            <label className="form-label">Content</label>
                            <ReactQuill
                                theme="snow" 
                                maxLength={2000}
                                minLength={25}
                                //value={blog.econtent}
                                //onChange={(value) => setBlog({ ...blog, econtent: value })}
                            />
                            
                        </div>
                    </div>
                    <div className="modal-footer" >
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                            Close
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            //onClick={handleClick}
                            //disabled={blog.etitle.length < 5 || blog.econtent.length < 5 || blog.econtent.length > 6000 || blog.etitle.length > 100}
                        >
                            Save Changes
                        </button>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div >
  )
}

export default Notify
